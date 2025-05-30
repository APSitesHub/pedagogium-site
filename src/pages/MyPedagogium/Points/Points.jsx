import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import eyesImg from '../../../img/quiz/eyes.png';
import {
  CupIcon,
  EyesEmoji,
  LeaderPlace,
  PointsBox,
  PointsBoxHeading,
  PointsCategory,
  PointsCategoryPicker,
  PointsCategoryPointer,
  PointsLeader,
  PointsLeaderboard,
  PointsPlaceHolder,
  PointsPlaceHolderText,
  PointsTableHead,
  PointsTableHeadItem,
  PointsTableHeadItemWide,
  PointsUser,
  PointsUserData,
  PointsUserDataWide,
  UserPlace,
} from './Points.styled';

export const Points = ({ user, flatPoints }) => {
  const [position, setPosition] = useState('0%');
  const [activeRating, setActiveRating] = useState(0);

  const pointsSorted = flatPoints.sort((a, b) => b.points - a.points);

  const userPlace = pointsSorted.findIndex(
    leader => leader.name.toLowerCase() === user.name.toLowerCase()
  );

  useEffect(() => {
    console.log(user);
  }, [user]);

  const calculatePointerPosition = i => {
    setPosition(position => (position = `${i * 100}%`));
    setActiveRating(i);
  };

  return (
    <PointsBox style={{ top: '145px' }}>
      <PointsBoxHeading>
        <CupIcon />
        Рейтинг
      </PointsBoxHeading>
      {userPlace === -1 ? (
        <PointsPlaceHolder>
          <EyesEmoji src={eyesImg} alt="Eyes emoji" width="80" />
          <PointsPlaceHolderText>Шукаємо вас у рейтингу.</PointsPlaceHolderText>
          <PointsPlaceHolderText>
            Виконайте ще кілька вправ, <br /> щоб бути в топі! 🤩
          </PointsPlaceHolderText>
        </PointsPlaceHolder>
      ) : (
        <>
          <PointsTableHead>
            <PointsTableHeadItem>Місце</PointsTableHeadItem>
            <PointsTableHeadItemWide>Прізвище та ім’я</PointsTableHeadItemWide>
            <PointsTableHeadItem>Бали</PointsTableHeadItem>
          </PointsTableHead>
          <PointsUser>
            <PointsUserData>
              {pointsSorted.findIndex(
                leader => leader.name.toLowerCase() === user.name.toLowerCase()
              ) + 1}
            </PointsUserData>
            <PointsUserDataWide>{user.name}</PointsUserDataWide>
            <PointsUserData>
              {pointsSorted[userPlace].points < 0
                ? 0
                : pointsSorted[userPlace].points}
            </PointsUserData>
          </PointsUser>
          <PointsLeaderboard>
            {pointsSorted.slice(0, 10).map((leader, i) => (
              <PointsLeader key={nanoid(8)}>
                {i <= 2 ? (
                  <LeaderPlace>{i + 1}</LeaderPlace>
                ) : (
                  <UserPlace>{i + 1}</UserPlace>
                )}
                <PointsUserDataWide>{leader.name}</PointsUserDataWide>
                <PointsUserData>{leader.points}</PointsUserData>
              </PointsLeader>
            ))}
          </PointsLeaderboard>
        </>
      )}
    </PointsBox>
  );
};
