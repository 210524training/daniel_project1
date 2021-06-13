/* eslint-disable quote-props */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from './connection/connectionService';
import User from '../models/user';
import Detail from '../models/detail';

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

  async putReim(detail:Detail, empId:string): Promise<string> {
    const id = String(Math.floor(Math.random() * 100000));
    const params = {
      TableName: 'Reimbursement',
      Item: {
        'Thing': 'reimbursement',
        'ID': id,
        'EmpID': empId,
        'Details': detail,
        'Urgent': false, // needs to be fixed
        'gradeSubmission': 'not yet',
        'PassedOrNot': 'waiting',
        'Supervisor': 'supervisor', // needs to be fixed
        'DS_PreApproval': 'waiting',
        'DH_PreApproval': 'not yet',
        'Benco_PreApproval': 'not yet',
        'PostApproval': 'not yet',
        'FinalAmount': 0,
        'Difference': '',
        'Reason': 'not yet',
        'EmpApproval': 'not yet',
        'GradeCheck': 'not yet',
      },
    };
    const data = await this.docClient.put(params).promise();
    console.log('Added item:', JSON.stringify(data, null, 2));
    if(data) {
      return 'success';
    }
    return 'failed';
  }
}

export default new UserDao();
