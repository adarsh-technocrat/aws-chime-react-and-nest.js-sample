import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

class DeleteAttendeeDto {
  @IsOptional()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  attendeeId: string;
}

export default DeleteAttendeeDto;
