import React from 'react';
import styled from 'styled-components';
import { TeacherChartBtn } from '../StudentChart/StudentChart.styled';
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router-dom';

// Стилі для модального вікна
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  padding-bottom: 72px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  height: 65%;
  width: 50%;
`;

const CloseButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const QRContainer = styled.div`
  flex: 1;
  max-width: 100%;
  max-height: 100%;
`;

export const QRCodeModal = ({ onClose, isOpen }) => {
  const { group } = useParams();

  return (
    isOpen && (
      <ModalOverlay>
        <ModalContent>
          <QRContainer>
            <QRCodeSVG
              value={`${window.location.origin}/lesson/${group}?isOffline=true`}
              size={1024}
              style={{ width: '100%', height: '100%' }}
            />
            <CloseButtonWrapper>
              <TeacherChartBtn onClick={onClose}>Close</TeacherChartBtn>
            </CloseButtonWrapper>
          </QRContainer>
        </ModalContent>
      </ModalOverlay>
    )
  );
};
