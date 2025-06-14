import { Input, InputNote } from 'components/LeadForm/LeadForm.styled';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

export const LinkToUsersAdminPanel = styled(Link)`
  position: absolute;
  top: 50px;
  left: 50px;
  background: linear-gradient(
      322deg,
      var(--accent-color) -5.61%,
      var(--main-color) 93.88%
    ),
    var(--accent-color);
  border: 1px solid var(--main-color);
  border-radius: 50px;
  color: var(--main-color);
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  transition: color var(--animation-global);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 36px;
  transition: all ease-in-out 0.3s;

  &:hover {
    width: 200px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
  }

  &::before {
    content: 'Panel studentów';
    color: var(--secondary-color);
    font-weight: 600;
    transition: all var(--animation-global);
  }

  &:hover::before {
    content: 'Do panelu studentów';
    font-weight: 700;
  }
`;

export const LinkToTeacherAdminPanel = styled(Link)`
  position: absolute;
  top: 100px;
  left: 50px;
  background: linear-gradient(
      322deg,
      var(--accent-color) -5.61%,
      var(--main-color) 93.88%
    ),
    var(--accent-color);
  border: 1px solid var(--main-color);
  border-radius: 50px;
  color: var(--main-color);
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  transition: color var(--animation-global);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 36px;
  transition: all ease-in-out 0.3s;

  &:hover {
    width: 200px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
  }

  &::before {
    content: 'Panel kuratora';
    color: var(--secondary-color);
    font-weight: 600;
    transition: all var(--animation-global);
  }

  &:hover::before {
    content: 'Do panelu kuratora';
    font-weight: 700;
  }
`;
