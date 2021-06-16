/* eslint-disable quote-props */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from './connection/connectionService';
import Reim from '../models/reim';
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

  async getReim(id:string): Promise<Reim | undefined> {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'reimbursement',
        'ID': id,
      },
    };
    const data = await this.docClient.get(params).promise();
    return data.Item as Reim | undefined;
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

  async getPreApproval(role:string): Promise<Reim[]> {
    const params = {
      TableName: 'Reimbursement',
      KeyConditionExpression: '#T = :u',
      FilterExpression: '#R = :a',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#R': role,
      },
      ExpressionAttributeValues: {
        ':u': 'reimbursement',
        ':a': 'waiting',
      },
    };
    const data = await this.docClient.query(params).promise();
    if(data.Items) {
      return data.Items as Reim[];
    }
    return [];
  }

  async getReimEmpApproval(userID:string): Promise<Reim[]> {
    const params = {
      TableName: 'Reimbursement',
      KeyConditionExpression: '#T = :u',
      FilterExpression: '#E=:a, #A=:p',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#E': 'EmpID',
        '#A': 'EmpApproval',
      },
      ExpressionAttributeValues: {
        ':u': 'reimbursement',
        ':a': userID,
        ':p': 'waiting',
      },
    };
    const data = await this.docClient.query(params).promise();
    if(data.Items) {
      return data.Items as Reim[];
    }
    return [];
  }

  async updateEmpApproval(id:string, approve:string): Promise<void> {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'reimbursement',
        'ID': id,
      },
      UpdateExpression: 'set  #W=:c',
      ExpressionAttributeNames: {
        '#W': 'EmpApproval',
      },
      ExpressionAttributeValues: {
        ':c': approve,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const returned = await this.docClient.update(params).promise();
    console.log(returned);
  }

  async getReimGradeCheck(): Promise<Reim[]> {
    const params = {
      TableName: 'Reimbursement',
      KeyConditionExpression: '#T = :u',
      FilterExpression: '#G = :a',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#G': 'GradeCheck',
      },
      ExpressionAttributeValues: {
        ':u': 'reimbursement',
        ':a': 'waiting',
      },
    };
    const data = await this.docClient.query(params).promise();
    if(data.Items) {
      return data.Items as Reim[];
    }
    return [];
  }

  async updatePreApproval(id:string, who:string, change:string, reason:string): Promise<void> {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'reimbursement',
        'ID': id,
      },
      UpdateExpression: 'set  #W=:c, Reason=:r',
      ExpressionAttributeNames: {
        '#W': who,
      },
      ExpressionAttributeValues: {
        ':c': change,
        ':r': reason,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const returned = await this.docClient.update(params).promise();
    console.log(returned);
  }

  async updatePostApproval(id:string,
    amount:Number,
    approve:string,
    reason:string,
    empApproval:string): Promise<void> {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'reimbursement',
        'ID': id,
      },
      UpdateExpression: 'set  PostApproval=:a, FinalAmount=:f, Reason=:r, EmpApproval=:e',
      ExpressionAttributeValues: {
        ':a': approve,
        ':r': reason,
        ':f': amount,
        ':e': empApproval,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const returned = await this.docClient.update(params).promise();
    console.log(returned);
  }

  async updateGradeCheck(id:string, approve:string): Promise<void> {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'reimbursement',
        'ID': id,
      },
      UpdateExpression: 'set GradeCheck=:a',
      ExpressionAttributeValues: {
        ':a': approve,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const returned = await this.docClient.update(params).promise();
    console.log(returned);
  }
}

export default new UserDao();
