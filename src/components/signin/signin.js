import { useAuth0 } from '@auth0/auth0-react';
/* eslint-disable no-console */
import React, { useEffect } from 'react';
import DropdownIcon from '../dropdown-icon/dropdown-icon';
import {
  GetGithubOrganisations,
  setUserOrganisation,
} from '../../services/apiService';

const SignIn = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    user,
    getIdTokenClaims,
  } = useAuth0();

  useEffect(() => {
    isAuthenticated ? setUserOrg() : null;
  });

  const setUserOrg = async () => {
    isAuthenticated
      ? await GetGithubOrganisations(user.nickname)
          .then(async (success) => {
            const jwt = await getIdTokenClaims();
            success.forEach(async (org) => {
              const data = {
                OrganisationId: org.id.toString(),
                UserId: user.sub,
              };
              await setUserOrganisation(data, jwt.__raw).catch((err) => {
                console.error('error: ' + err);
              });
            });
          })
          .catch((err) => {
            console.error('error: ' + err);
          })
      : null;
  };
  const currentPage =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').pop()
      : null;

  return (
    <div className="action-btn-container">
      {!isAuthenticated ? (
        <button
          className="btn btn-red"
          onClick={() => {
            loginWithRedirect({
              appState: {
                targetUrl: currentPage,
              },
            });
          }}
        >
          Log in
        </button>
      ) : (
        <>
          <DropdownIcon />
        </>
      )}
    </div>
  );
};

export default SignIn;
