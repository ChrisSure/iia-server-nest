import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlarmDocument = Alarm & Document;

@Schema()
export class Alarm {
  @Prop({ required: true })
  date: Date;
}

export const AlarmSchema = SchemaFactory.createForClass(Alarm);
