import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Username',
    type: String,
    example: 'john',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserDto {
  @ApiProperty({
    description: 'Username',
    type: String,
    example: 'john',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: '12345678',
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Email',
    type: String,
    example: 'john@gmail.com',
  })
  @IsEmail()
  @IsString()
  email: string;
}
