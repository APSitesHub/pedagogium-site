import { Input, InputNote } from 'components/LeadForm/LeadForm.styled';
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
