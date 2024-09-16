import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsDateString,
  IsArray,
  ValidateNested,
  IsUrl,
  Matches,
  Length,
  ValidateIf,
} from 'class-validator';

class Position {
  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}

class InternalNodeData {
  @IsString()
  id!: string;
}

class ExternalNodeData {
  @IsString()
  @Length(2, 100)
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
  name!: string;

  @IsOptional()
  @Length(25, 300)
  @IsString()
  description?: string;

  @IsUrl()
  path!: string;
}

class InternalNode {
  @IsIn([`internal`])
  type!: 'internal';

  @IsString()
  id!: string;

  @ValidateNested()
  position!: Position;

  @IsOptional()
  @ValidateNested()
  data?: InternalNodeData | null;
}

class ExternalNode {
  @IsIn([`external`])
  type!: 'external';

  @IsString()
  id!: string;

  @ValidateNested()
  position!: Position;

  @ValidateNested()
  data!: ExternalNodeData;
}

class Edge {
  @IsString()
  id!: string;

  @IsString()
  source!: string;

  @IsString()
  target!: string;

  @IsIn([`curved`, `linear`])
  type!: 'curved' | 'linear';
}

export class Mindmap {
  @IsString()
  id!: string;

  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(25, 300)
  description?: string;

  @IsIn([`x`, `y`])
  orientation!: 'x' | 'y';

  @IsDateString()
  cdate!: string;

  @IsDateString()
  mdate!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ValidateIf(
    (obj, value) =>
      value &&
      value.every(
        (node: any) => node.type === `internal` || node.type === `external`,
      ),
  )
  nodes!: (InternalNode | ExternalNode)[];

  @IsArray()
  @ValidateNested({ each: true })
  edges!: Edge[];
}
