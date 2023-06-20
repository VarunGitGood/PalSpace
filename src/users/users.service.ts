import { Injectable } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getFriends(req: Request): Promise<any> {
    const authUser: any = req['user'];

    const user = await this.prismaService.user.findUnique({
      where: {
        username: authUser.username,
      },
    });

    try {
      const friends = await this.prismaService.friendship.findMany({
        where: {
          status: FriendshipStatus.ACCEPTED,
          OR: [{ senderId: user.uid }, { receiverId: user.uid }],
        },
      });
      if (friends.length === 0) {
        return Promise.resolve({
          message: 'No Friend Found',
          friends,
        });
      }
      return Promise.resolve({
        message: 'success',
        friends,
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error,
      });
    }
  }

  async addFriend(req: Request, friendId: string): Promise<any> {
    const authUser: any = req['user'];
    const user = await this.prismaService.user.findUnique({
      where: {
        username: authUser.username,
      },
    });
    try {
      const isFriend = await this.prismaService.friendship.findFirst({
        where: {
          AND: [
            {
              senderId: user.uid,
              receiverId: Number(friendId),
            },
          ],
        },
      });
      if (isFriend) {
        return Promise.resolve({
          message: 'Request already sent',
        });
      }
      const friendRequest = await this.prismaService.friendship.create({
        data: {
          senderId: user.uid,
          receiverId: Number(friendId),
        },
      });
      return Promise.resolve({
        message: 'success',
        data: friendRequest,
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error: error,
      });
    }
  }
  async acceptFriend(req: Request, senderId: string): Promise<any> {
    const authUser: any = req['user'];
    const user = await this.prismaService.user.findUnique({
      where: {
        username: authUser.username,
      },
    });

    try {
      const hasFriendRequest = await this.prismaService.friendship.findFirst({
        where: {
          AND: [
            {
              senderId: Number(senderId),
              receiverId: Number(user.uid),
              status: FriendshipStatus.PENDING,
            },
          ],
        },
      });
      if (!hasFriendRequest) {
        return Promise.resolve({
          message: 'No friend request found',
        });
      }
      const acceptFriendRequest = await this.prismaService.friendship.update({
        where: {
          id: hasFriendRequest.id,
        },
        data: {
          status: FriendshipStatus.ACCEPTED,
          statusUpdateAt: new Date(),
        },
      });
      return Promise.resolve({
        message: 'Friend Request Accepted',
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error: error,
      });
    }
  }
  async rejectFriend(req: Request, senderId: string): Promise<any> {
    const authUser: any = req['user'];
    const user = await this.prismaService.user.findUnique({
      where: {
        username: authUser.username,
      },
    });

    try {
      const hasFriendRequest = await this.prismaService.friendship.findFirst({
        where: {
          AND: [
            {
              senderId: Number(senderId),
              receiverId: Number(user.uid),
              status: FriendshipStatus.PENDING,
            },
          ],
        },
      });
      if (!hasFriendRequest) {
        return Promise.resolve({
          message: 'No friend request found',
        });
      }
      const rejectFriendRequest = await this.prismaService.friendship.update({
        where: {
          id: hasFriendRequest.id,
        },
        data: {
          status: FriendshipStatus.REJECTED,
          statusUpdateAt: new Date(),
        },
      });
      return Promise.resolve({
        message: 'Friend Request Rejected!',
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error: error,
      });
    }
  }
  async pendingRequest(req: Request): Promise<any> {
    const authUser: any = req['user'];
    const user = await this.prismaService.user.findUnique({
      where: {
        username: authUser.username,
      },
    });
    try {
      const pendingRequests = await this.prismaService.friendship.findMany({
        where: {
          AND: [
            {
              receiverId: Number(user.uid),
              status: FriendshipStatus.PENDING,
            },
          ],
        },
      });
      if (pendingRequests.length === 0) {
        return Promise.resolve({
          message: 'No friend request found',
          pendingRequests: pendingRequests,
        });
      }

      return Promise.resolve({
        message: 'success',
        pendingRequests,
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error: error.message,
      });
    }
  }
  async removeFriend(req: Request, friendId: string): Promise<any> {
    const authUser: any = req['user'];

    const user = await this.prismaService.user.findUnique({
      where: {
        username: authUser.username,
      },
    });

    try {
      const friendShip = await this.prismaService.friendship.findFirst({
        where: {
          AND: [
            {
              senderId: user.uid,
              receiverId: Number(friendId),
              status: FriendshipStatus.ACCEPTED,
            },
          ],
        },
      });
      if (!friendShip) {
        return Promise.resolve({
          message: 'No Such FriendShip Exists',
        });
      }
      const removeFriend = await this.prismaService.friendship.delete({
        where: {
          id: friendShip.id,
        },
      });
      return Promise.resolve({
        message: 'Successfully Removed From FriendList',
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error,
      });
    }
  }
}
