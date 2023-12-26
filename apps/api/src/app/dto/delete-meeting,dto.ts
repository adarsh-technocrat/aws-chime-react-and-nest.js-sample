import { IsString, IsOptional } from 'class-validator';

class DeleteMeetingDto {
  @IsOptional()
  @IsString()
  meetingId: string;
}

export default DeleteMeetingDto;
