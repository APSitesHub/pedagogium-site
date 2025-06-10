import styled from 'styled-components';
import { ReactComponent as _ArrowDownIcon } from '../../../img/svg/invertedDownArrow.svg';
import { Field, Form } from 'formik';
import { InputNote } from 'components/LeadForm/LeadForm.styled';

export const AdminPanelSection = styled.section`
  height: max-content;
  min-height: 100vh;
  padding: 30px 20px;
  display: flex;
  align-items: flex-start;

  gap: 30px;
`;

export const Input = styled(Field)`
  width: 100%;
  height: 58px;
  padding: 22px 20px;
  font-size: 14px;
  border: 2px solid var(--main-color);
  border-radius: 50px;
  line-height: 1;

  @media screen and (min-width: 768px) {
    height: 59px;
    padding: 20px 40px;
    font-size: 19px;
  }

  &:hover,
  &:focus {
    background-color: var(--secondary-burnt-color);
    outline: transparent;
  }

  &:-webkit-autofill {
    &,
    &:hover,
    &:focus {
      -webkit-box-shadow: 0 0 0px 1000px var(--accent-semi-transparent-color) inset;
    }
  }

  &::placeholder {
  }
`;

export const FormBtn = styled.button`
  display: block;
  margin: 0 auto;
  width: 100%;

  padding: 20px;
  font-size: 16px;
  font-weight: 700;

  text-transform: uppercase;
  color: var(--secondary-color);
  border-radius: 50px;
  background: linear-gradient(322deg, #0f645b 23.22%, #09c6cc 110.01%), #0f645b;
  border: none;
  flex-shrink: 0;
  cursor: pointer;

  outline: transparent;

  @media screen and (min-width: 768px) {
    font-size: 20px;
    letter-spacing: 0.6px;
    height: 70px;
  }

  &:hover,
  &:focus {
  }
`;

export const LoginForm = styled(Form)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  gap: 35px;
`;

export const AdminFormBtn = styled(FormBtn)`
  margin: 0 auto;
  height: 48px;
  padding: 0;
`;

export const AdminInput = styled(Input)`
  width: 240px;
  padding: 8px 10px;
  font-size: 16px;
  height: 40px;
  -webkit-text-stroke: 0px;

  border: 2px solid var(--main-color);

  &.error {
    border-color: red;
  }

  @media screen and (min-width: 768px) {
    width: 360px;
  }
`;

export const AdminInputNote = styled(InputNote)`
  color: var(--main-color);
  font-size: 12px;
  font-weight: 500;
  position: static;
  max-width: 240px;

  @media screen and (min-width: 768px) {
    max-width: 360px;
  }
`;

export const UsersForm = styled(Form)`
  margin: 0 auto;

  position: sticky;
  top: 50%;

  transform: translateY(-50%);

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const UsersEditForm = styled(Form)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 400px;

  background-color: white;
  padding: 24px;
  border-radius: 24px;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const UserEditButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
`;

export const UserDeleteButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: 1px solid var(--main-color);
  border-radius: 5px;
`;

export const UserDBTable = styled.table`
  max-width: 50vw;
  min-height: 80vh;
  margin: 0 auto;

  table-layout: auto;
  width: 100%;

  text-align: center;
  border: 1px solid #000;
  border-collapse: collapse;
`;

export const UserDBCaption = styled.caption`
  caption-side: top;
  margin-bottom: 20px;
`;

export const UserDBRow = styled.tr`
  border: 1px solid #000;
`;

export const UserHeadCell = styled.th`
  border: 1px solid #000;
  padding: 3px;
`;

export const UserCell = styled.td`
  border: 1px solid #000;
  padding: 3px;
  height: 3em;

  &.last-name {
    text-transform: capitalize;
  }

  &.attention {
    color: red;
  }

  &.error {
    background-color: #ff0000;
  }
`;

export const ArrowDownIcon = styled(_ArrowDownIcon)`
  width: 12px;
  height: 12px;
  cursor: pointer;

  color: #000;

  &:hover {
    color: var(--main-color);
  }
`;

export const DatesEditBlock = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 400px;

  background-color: white;
  padding: 24px;
  border-radius: 24px;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;
