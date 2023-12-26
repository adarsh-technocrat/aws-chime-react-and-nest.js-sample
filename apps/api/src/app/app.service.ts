/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import JoinMeetingDTO from './dto/do-meeting.dto';
import DeleteMeetingDto from './dto/delete-meeting,dto';
import DeleteAttendeeDto from './dto/delete-attendee.dto';
import AWS from 'aws-sdk';

@Injectable()
export class AppService {
  private chime: AWS.Chime;
  private awsCredentials: AWS.Credentials;

  constructor() {
    this.chime = new AWS.Chime({
      accessKeyId: '<ACCESS_KEY_ID>',
      secretAccessKey: '<SECRET_ACCESS_KEY>',
      region: 'us-east-1',
    });
    this.chime.endpoint = new AWS.Endpoint(
      'https://meetings-chime.us-east-1.amazonaws.com'
    );
  }

  async deleteMeeting(deleteMeetingDto: DeleteMeetingDto) {
    try {
      await this.chime
        .deleteMeeting({
          MeetingId: deleteMeetingDto.meetingId,
        })
        .promise();
      return 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteAttendee(deleteAttendeeDto: DeleteAttendeeDto) {
    try {
      await this.chime
        .deleteAttendee({
          MeetingId: deleteAttendeeDto.meetingId,
          AttendeeId: deleteAttendeeDto.attendeeId,
        })
        .promise();
      return 0;
    } catch (error) {
      throw error;
    }
  }

  async joinMeeting(joinMeetingDto: JoinMeetingDTO) {
    try {
      let meeting;
      if (
        joinMeetingDto?.meetingId === '' ||
        joinMeetingDto?.meetingId === null ||
        joinMeetingDto?.meetingId === 'null' ||
        !joinMeetingDto?.meetingId
      ) {
        const meetingToken = this.create_UUID();
        console.log('NOTE: NEW MEETING');
        meeting = await this.chime
          .createMeeting({
            ClientRequestToken: meetingToken,
            MediaRegion: 'us-east-1',
            ExternalMeetingId: meetingToken,
          })
          .promise();
      } else {
        meeting = await this.chime
          .getMeeting({
            MeetingId: joinMeetingDto?.meetingId,
          })
          .promise();
      }

      console.log(meeting?.Meeting?.MeetingId);

      // Add attendee to the meeting (new or existing)
      const attendee = await this.chime
        .createAttendee({
          MeetingId: meeting.Meeting.MeetingId,
          ExternalUserId: `${joinMeetingDto?.userName}#${joinMeetingDto?.userId}`,
        })
        .promise();

      return {
        Info: {
          Meeting: meeting,
          Attendee: attendee,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async generateMeetingLik() {
    try {
      const meetingToken = this.create_UUID();
      console.log('NOTE: NEW MEETING');
      const meeting = await this.chime
        .createMeeting({
          ClientRequestToken: meetingToken,
          MediaRegion: 'us-east-1',
          ExternalMeetingId: meetingToken,
        })
        .promise();

      const generateMeetingLink = `http://localhost:4200?meetingId=${meeting?.Meeting?.MeetingId}`;

      return {
        Info: {
          MeetingLink: generateMeetingLink,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  create_UUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
}
