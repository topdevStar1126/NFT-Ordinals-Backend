import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from '@/interfaces';
import { CollectionSchemaModel } from '@/schemas';
import { CreateCollectionDto, UpdateCollectionDto } from './collections.dto';
import { CollectionDocument } from '@/schemas/collection.schema';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(CollectionSchemaModel.name)
    private readonly collectionModel: Model<CollectionDocument>,
  ) {}

  async create(
    creator: string,
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.collectionModel.create({
      ...createCollectionDto,
      creator,
      createdAt: new Date(),
    });
    return collection as Collection;
  }

  async findAll(): Promise<Array<Collection>> {
    const collections = await this.collectionModel.find().exec();
    return collections as Array<Collection>;
  }

  async findAllByChainId(chainId: number): Promise<Array<Collection>> {
    const collections = await this.collectionModel.find({ chainId }).exec();
    return collections as Array<Collection>;
  }

  async findOne(chainId: number, address: string): Promise<Collection> {
    const collection = await this.collectionModel
      .findOne({
        chainId,
        address,
      })
      .exec();
    return collection as Collection;
  }

  async update(
    creator: string,
    chainId: number,
    address: string,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.collectionModel.findOneAndUpdate(
      {
        creator,
        chainId,
        address,
      },
      { ...updateCollectionDto },
    );
    return collection as Collection;
  }
}
