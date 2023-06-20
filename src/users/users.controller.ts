import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('friends')
  @UseGuards(AuthenticationGuard)
  async getFriends(@Req() req: Request) {
    return this.userService.getFriends(req);
  }

  @Post('friends/requests')
  @UseGuards(AuthenticationGuard)
  async SendFriendRequest(@Req() req: Request) {
    const { userId } = req.body;
    return this.userService.addFriend(req, userId);
  }
  @Post('friends/requests/accept')
  @UseGuards(AuthenticationGuard)
  async AcceptFriendRequest(@Req() req: Request) {
    const { senderId } = req.body;
    return this.userService.acceptFriend(req, senderId);
  }
  @Post('friends/requests/reject')
  @UseGuards(AuthenticationGuard)
  async RejectFriendRequest(@Req() req: Request) {
    const { senderId } = req.body;
    return this.userService.rejectFriend(req, senderId);
  }
  @Get('friends/requests/pending')
  @UseGuards(AuthenticationGuard)
  async PendingRequest(@Req() req: Request) {
    return this.userService.pendingRequest(req);
  }
}
