import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

class JoinMeetingDTO {
  @IsString()
  @IsOptional()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userName: string;
}

export default JoinMeetingDTO;
