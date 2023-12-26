/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from 'amazon-chime-sdk-js';
import { Box, Button, Container, Typography } from '@mui/material';

import axios from 'axios';
import { useQueryParams } from '../hook/useQueryParams';
// import styles from './app.module.scss';

export function App() {
  const logger = new ConsoleLogger('Logger', LogLevel.INFO);
  const deviceController = new DefaultDeviceController(logger);

  const [meetingSession, setMeetingSession] = useState<DefaultMeetingSession>();
  const [meetingData, setMeetingData] = useState();
  const [hasStartedMediaInputs, setStartedMediaInputs] = useState(false);

  const query = useQueryParams();
  const meetingId = query.getQueryParamValue('meetingId');
  const userIdQuery = query.getQueryParamValue('userId');
  const userNameQuery = query.getQueryParamValue('userName');

  const joinMeetingSession = async () => {
    const userId = userIdQuery ?? '58';
    const userName = userNameQuery ?? 'Adarsh Kumar Singh';
    let meetingUrl = `userId=${userId}&userName=${userName}`;
    if (meetingId) {
      meetingUrl += `&meetingId=${meetingId}`;
    }
    const response = await axios.get(
      `http://localhost:3000/api/meeting/joinMetting?${meetingUrl}`
    );
    const { Info } = response.data;
    const { Meeting, Attendee } = Info;
    setMeetingData(Info);
    const configuration = new MeetingSessionConfiguration(Meeting, Attendee);
    const mettingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    );
    setMeetingSession(mettingSession);
  };

  console.log(meetingData);

  useEffect(() => {
    if (!meetingSession) {
      return;
    }
    const setupInput = async ({ audioId, videoId }: any = {}) => {
      if (!audioId || !videoId) {
        throw new Error('No video nor audio input detected.');
      }
      if (audioId) {
        const audioInputDevices =
          await meetingSession.audioVideo.listAudioInputDevices();
        if (audioInputDevices.length) {
          await meetingSession.audioVideo.startAudioInput(audioId);
        }
      }
      if (videoId) {
        const videoInputDevices =
          await meetingSession.audioVideo.listVideoInputDevices();
        if (videoInputDevices.length) {
          const defaultVideoId = videoInputDevices[0].deviceId;
          console.warn('starting video input');
          await meetingSession.audioVideo.startVideoInput(
            videoId === 'default' ? defaultVideoId : videoId
          );
          setStartedMediaInputs(true);
        }
      }
    };

    setupInput({ audioId: 'default', videoId: 'default' }).then(() => {
      const observer = {
        audioInputMuteStateChanged: (device: any, muted: any) => {
          console.warn(
            'Device',
            device,
            muted ? 'is muted in hardware' : 'is not muted'
          );
        },
      };
      meetingSession.audioVideo.addDeviceChangeObserver(observer);

      meetingSession.audioVideo.start();
    });
    console.warn('Meeting session instance...', meetingSession);
  }, [meetingSession, meetingData]);

  return (
    <Box
      width="100%"
      paddingBottom="50px"
      paddingTop="50px"
      overflow="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <MainHeader />
      <MainJoiningMeeting
        onJoin={joinMeetingSession}
        meetingData={meetingData}
      />
      {meetingSession && hasStartedMediaInputs && (
        <>
          <Controls meetingSession={meetingSession} />
          <VideoLocalOutput meetingSession={meetingSession} />
          <VideoRemoteOutput meetingSession={meetingSession} />
        </>
      )}
    </Box>
  );
}

function MainHeader() {
  return (
    <Box component="header" textAlign="center">
      <Typography component="h1" variant="h4">
        Simple Amazon Chime SDK App
      </Typography>
    </Box>
  );
}

function MainJoiningMeeting({
  onJoin,
  meetingData,
}: {
  onJoin: () => void;
  meetingData: any;
}) {
  const query = useQueryParams();
  const meetingId = query.getQueryParamValue('meetingId');

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="p" variant="body1" marginTop="20px">
        Start Meeting Session -{' '}
        {window.origin +
          `?meetingId=${meetingData?.Meeting?.MeetingId ?? meetingId}`}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={() => {
          onJoin();
        }}
      >
        {meetingId ? 'Join Call' : 'Start call'}
      </Button>
    </Container>
  );
}

function Controls({
  meetingSession,
}: {
  meetingSession: DefaultMeetingSession;
}) {
  return (
    <Box component="section">
      <h3>Controls</h3>
      <Button
        type="button"
        color="error"
        onClick={() => meetingSession.audioVideo.stop()}
      >
        Stop call
      </Button>
    </Box>
  );
}

function VideoLocalOutput({
  meetingSession,
}: {
  meetingSession: DefaultMeetingSession;
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoElement = videoRef.current;

    const observer = {
      videoTileDidUpdate: (tileState: any) => {
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }
        meetingSession.audioVideo.bindVideoElement(
          tileState.tileId,
          videoElement
        );
      },
    };
    meetingSession.audioVideo.addObserver(observer);

    meetingSession.audioVideo.startLocalVideoTile();
  }, [meetingSession]);

  return (
    <Box component="section">
      <h3>Video Local Output</h3>
      <PeerBox enabled>
        <Video ref={videoRef} />
      </PeerBox>
    </Box>
  );
}

function VideoRemoteOutput({
  meetingSession,
}: {
  meetingSession: DefaultMeetingSession;
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const videoElement = videoRef.current;

    const observer = {
      videoTileDidUpdate: (tileState: any) => {
        if (
          !tileState.boundAttendeeId ||
          tileState.localTile ||
          tileState.isContent
        ) {
          return;
        }
        meetingSession.audioVideo.bindVideoElement(
          tileState.tileId,
          videoElement
        );
      },
    };
    meetingSession.audioVideo.addObserver(observer);
  }, [meetingSession]);

  return (
    <Box component="section">
      <h3>Video Remote Output</h3>
      <PeerBox enabled>
        <Video ref={videoRef} />
      </PeerBox>
    </Box>
  );
}

const PeerBox = ({ enabled, ...props }: any) => (
  <Box
    display={enabled ? 'inline-block' : 'none'}
    width="200px"
    height="150px"
    backgroundColor="black"
    margin="10px"
    {...props}
  />
);

const Video = forwardRef((props: any, ref: any) => (
  <video
    ref={ref}
    width="100%"
    height="100%"
    style={{ objectFit: 'cover' }}
    {...props}
  />
));
export default App;
