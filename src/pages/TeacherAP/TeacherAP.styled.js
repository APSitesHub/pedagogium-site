import styled from 'styled-components';
import { ReactComponent as FormBackgroundStar } from '../../img/svg/heroStar.svg';

export const LeftFormBackgroundStar = styled(FormBackgroundStar)`
  position: absolute;
  left: 24px;
  bottom: -112px;

  opacity: 0.1;
  width: 89px;
  height: 89px;

  @media screen and (min-width: 1280px) {
    width: 310px;
    height: 310px;
    top: 345px;
    left: -360px;
  }
`;

export const RightFormBackgroundStar = styled(FormBackgroundStar)`
  position: absolute;
  right: 8px;
  top: -193px;

  opacity: 0.1;
  width: 42px;
  height: 42px;

  @media screen and (min-width: 1280px) {
    width: 98px;
    height: 98px;
    right: -149px;
    top: -62px;
  }
`;

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
