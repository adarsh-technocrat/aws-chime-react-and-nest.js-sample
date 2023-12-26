import { Controller, Delete, Get, Query } from '@nestjs/common';

import { AppService } from './app.service';
import JoinMeetingDTO from './dto/do-meeting.dto';
import DeleteMeetingDto from './dto/delete-meeting,dto';
import DeleteAttendeeDto from './dto/delete-attendee.dto';

@Controller('meeting')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/joinMetting')
  joinMeeting(@Query() joinMeetingDto: JoinMeetingDTO) {
    return this.appService.joinMeeting(joinMeetingDto);
  }

  @Get('/generate-meeting-link')
  generateMeetingLink() {
    return this.appService.generateMeetingLik();
  }

  @Delete('/delete-attendee')
  deleteAttendee(@Query() deleteAttendeeDto: DeleteAttendeeDto) {
    return this.appService.deleteAttendee(deleteAttendeeDto);
  }
  @Delete('/delete-meeting')
  deleteMeeting(@Query() deleteMeetingDto: DeleteMeetingDto) {
    return this.appService.deleteMeeting(deleteMeetingDto);
  }
}
