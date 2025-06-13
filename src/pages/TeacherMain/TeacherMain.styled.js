import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const LoginErrorNote = styled.p`
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  color: red;

  transition: opacity var(--animation-global);
`;

export const LoginFormText = styled.p`
  font-size: 16px;
  text-align: center;

  @media screen and (min-width: 1280px) {
    font-size: 24px;
    max-width: 840px;
  }
`;

export const StreamSection = styled.section`
  position: relative;
  overflow: hidden;
  height: 100vh;
`;

export const CourseList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CourseName = styled.p`
  font-size: 16px;
  text-align: center;
`;

export const GroupsList = styled.ul`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const GroupsListItem = styled.li`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0.5px solid var(--main-color);
`;

export const GroupLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;

  position: relative;
`;

export const GroupLinkNumber = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
`;
