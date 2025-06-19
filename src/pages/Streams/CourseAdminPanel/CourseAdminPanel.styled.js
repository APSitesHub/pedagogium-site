import { Input, InputNote } from 'components/LeadForm/LeadForm.styled';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const AdminInputHint = styled.p`
  color: var(--main-color);
  text-align: left;
  font-size: 12px;
  padding: 0 20px;
`;

export const AdminInput = styled(Input)`
  font-family: var(--new-font-family);
  font-size: 16px;
  padding: 20px;
  border: 2px solid var(--main-color);
  max-width: 600px;
`;

export const AdminInputNote = styled(InputNote)`
  position: static;
  color: #bb0000;
  font-size: 14px;
  bottom: -1.1em;
`;

export const LinkTo = styled(Link)`
  background: linear-gradient(
      322deg,
      var(--accent-color) -5.61%,
      var(--main-color) 93.88%
    ),
    var(--accent-color);
  border: 1px solid var(--main-color);
  border-radius: 50px;
  color: var(--main-color);
  font-size: 18px;
  text-align: center;
  cursor: pointer;
  transition: color var(--animation-global);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  transition: all ease-in-out 0.3s;
  color: var(--secondary-color);
  font-weight: 600;
  transition: all var(--animation-global);
  text-decoration: none;

  &:hover {
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
    transform: scale(1.1);

    ${({ $isDisabled }) =>
      $isDisabled &&
      css`
        transform: none;
        box-shadow: none;
      `}
  }

  ${({ $isDisabled }) =>
    $isDisabled &&
    css`
      background: linear-gradient(
          322deg,
          var(--main-transparent-color) -5.61%,
          var(--secondary-transparent-color) 93.88%
        ),
        var(--main-transparent-color);

      color: var(--main-color);
      cursor: default;
    `}
`;
