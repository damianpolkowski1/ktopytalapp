import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':imageName')
  serveImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const imagePath = path.join(__dirname, '../../..', 'uploads', imageName);
    return res.sendFile(imagePath);
  }

  @Post('uploadProfilePicture/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(__dirname, '../../..', 'uploads'),
        filename: (req, file, cb) => {
          const uuid = uuidv4();
          cb(null, `${uuid}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Dozwolone są jedynie pliki graficzne!'), false);
        } else {
          return cb(null, true);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    if (!file) {
      throw new HttpException(
        'Błąd podczas przesyłu pliku',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.imagesService.updateProfilePicture(userId, file.filename);
      return {
        message: 'Pomyślnie zaktualizowano zdjęcie profilowe!',
        filePath: file.filename,
      };
    } catch (error) {
      throw new HttpException(
        'Błąd podczas zapisu pliku na serwerze',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
