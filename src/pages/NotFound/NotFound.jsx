import {
  NotFoundLink,
  NotFoundLinkTitle,
  NotFoundLinkWrapper,
  NotFoundLinks,
  NotFoundSection,
  NotFoundTitle,
} from './NotFound.styled';

const NotFound = () => {
  return (
    <NotFoundSection id="hero">
      <NotFoundTitle>Такої сторінки в нас нема!</NotFoundTitle>
      <NotFoundLinkWrapper>
        <NotFoundLinkTitle>Але є інші!</NotFoundLinkTitle>
        <NotFoundLinks>
          <NotFoundLink to="/">На головну</NotFoundLink>
        </NotFoundLinks>
      </NotFoundLinkWrapper>
    </NotFoundSection>
  );
};

export default NotFound;
