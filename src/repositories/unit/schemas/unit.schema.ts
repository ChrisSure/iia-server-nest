import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema()
export class Unit {
  @Prop({ required: true, type: 'number' })
  point: number;

  @Prop({ required: true })
  date: Date;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
