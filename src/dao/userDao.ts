/* eslint-disable quote-props */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from './connection/connectionService';
import User from '../models/user';

class UserDao {
  constructor(
    private docClient: DocumentClient = dynamo,
  ) {}

  async getUser(id:string): Promise<User | undefined> {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'user',
        'ID': id,
      },
    };
    const data = await this.docClient.get(params).promise();
    return data.Item as User | undefined;
  }
}

export default new UserDao();
