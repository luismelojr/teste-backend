import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../infraestructure/jwt-auth.guard';
import { RolesGuard } from '../infraestructure/roles.guard';
import { Roles } from '../infraestructure/roles.decorator';

@Controller('admin')
export class AdminController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  getAdminResource() {
    return { message: 'This is an admin resource' };
  }
}

@Controller('manager')
export class ManagerController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Get()
  getManagerResource() {
    return { message: 'This is a manager resource' };
  }
}

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get()
  getUserResource() {
    return { message: 'This is a user resource' };
  }
}

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}

export const exportExempleController = [
  AdminController,
  ManagerController,
  UserController,
  ProfileController,
];
