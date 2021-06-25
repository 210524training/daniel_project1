/* eslint-disable quote-props */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from './connection/connectionService';
import Reim from '../models/reim';
import User from '../models/user';
import Detail from '../models/detail';
import RequestInfo from '../models/requestInfo';

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

  async getAllReim(empId:string): Promise<Reim[]> {
    const params = {
      TableName: 'Reimbursement',
      KeyConditionExpression: '#T=:ad',
      FilterExpression: 'EmpID=:e',
      ExpressionAttributeNames: {
        '#T': 'Thing',
      },
      ExpressionAttributeValues: {
        ':ad': 'reimbursement',
        ':e': empId,
      },
    };
    const data = await this.docClient.query(params).promise();
    return data.Items as Reim[];
  }

  async getRequestInfo(empId:string) {
    const params = {
      TableName: 'Reimbursement',
      ProjectionExpression: '#ID, ReimID, #Req, #Request',
      KeyConditionExpression: '#T=:ad',
      FilterExpression: '#Ans=:r and EmpID=:e',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#ID': 'ID',
        '#Ans': 'Answer',
        '#Req': 'Requestor',
        '#Request': 'Request',
      },
      ExpressionAttributeValues: {
        ':ad': 'additional info',
        ':e': empId,
        ':r': 'waiting',
      },
    };
    const data = await this.docClient.query(params).promise();
    console.log(data);
    if(data.Items) {
      return data.Items;
    }
    return [];
  }

  async getRequestSuper(requestor:string) {
    const params = {
      TableName: 'Reimbursement',
      ProjectionExpression: '#ID, ReimID, #Req, #Request, Answer',
      KeyConditionExpression: '#T=:ad',
      FilterExpression: '#Ans<>:r and #Req=:e',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#ID': 'ID',
        '#Ans': 'Answer',
        '#Req': 'Requestor',
        '#Request': 'Request',
      },
      ExpressionAttributeValues: {
        ':ad': 'additional info',
        ':e': requestor,
        ':r': 'waiting',
      },
    };
    const data = await this.docClient.query(params).promise();
    console.log(data);
    if(data.Items) {
      return data.Items;
    }
    return [];
  }

  async putMoreInfo(reqInfo:RequestInfo): Promise<string> {
    const params = {
      TableName: 'Reimbursement',
      Item: {
        'Thing': 'additional info',
        'ID': reqInfo.ID,
        'ReimID': reqInfo.ReimID,
        'Requestor': reqInfo.Requestor,
        'Request': reqInfo.Request,
        'EmpID': reqInfo.EmpId,
        'Answer': reqInfo.Answer,
        'Resolved': reqInfo.Resolved,
      },
    };
    const data = await this.docClient.put(params).promise();
    console.log('Added item:', JSON.stringify(data, null, 2));
    if(data) {
      return 'success';
    }
    return 'failed';
  }

  async updateStuff(id:string, thing:string, what:string, ch:string) {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': thing,
        'ID': id,
      },
      UpdateExpression: 'set #W=:c',
      ExpressionAttributeNames: {
        '#W': what,
      },
      ExpressionAttributeValues: {
        ':c': ch,
      },
      ReturnValues: 'ALL_NEW',
    };
    const returned = await this.docClient.update(params).promise();
    console.log(returned);
    return returned;
  }

  async updateFund(id:string, costP:number, costA:number) {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'user',
        'ID': id,
      },
      UpdateExpression: 'set Fund.Available = Fund.Available + :ca, Fund.Pending = Fund.Pending + :cp',
      ExpressionAttributeValues: {
        ':cp': costP,
        ':ca': costA,
      },
      ReturnValues: 'ALL_NEW',
    };
    const returned = await this.docClient.update(params).promise();
    console.log(returned);
    return returned;
  }

  async putReim(detail:Detail, empId:string): Promise<string> {
    const id = String(Math.floor(Math.random() * 1000));
    const params = {
      TableName: 'Reimbursement',
      Item: {
        'Thing': 'reimbursement',
        'ID': id,
        'EmpID': empId,
        'Details': detail,
        'Urgent': false, // needs to be fixed
        'gradeSubmission': 'not yet',
        'PassedOrNot': 'not yet',
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
        'file': undefined,
      },
    };
    const data = await this.docClient.put(params).promise();
    console.log('Added item:', JSON.stringify(data, null, 2));
    if(data) {
      return id;
    }
    return 'failed';
  }

  async getPreApproval(role:string) {
    const params = {
      TableName: 'Reimbursement',
      ProjectionExpression: '#ID, Details',
      KeyConditionExpression: '#T = :u',
      FilterExpression: '#R=:aa',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#R': role,
        '#ID': 'ID',
      },
      ExpressionAttributeValues: {
        ':u': 'reimbursement',
        ':aa': 'waiting',
      },
    };
    const data = await this.docClient.query(params).promise();
    console.log(data);
    if(data.Items) {
      return data.Items;
    }
    return [];
  }

  async getGradeSubs(id:string) {
    const params = {
      TableName: 'Reimbursement',
      ProjectionExpression: '#ID, Details, Answer',
      KeyConditionExpression: '#T = :u',
      FilterExpression: 'gradeSubmission=:aa and #Em=:user',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#Em': 'EmpID',
        '#ID': 'ID',
      },
      ExpressionAttributeValues: {
        ':u': 'reimbursement',
        ':aa': 'waiting',
        ':user': id,
      },
    };
    const data = await this.docClient.query(params).promise();
    console.log(data);
    if(data.Items) {
      return data.Items;
    }
    return [];
  }

  async getPostApproval() {
    const params = {
      TableName: 'Reimbursement',
      ProjectionExpression: '#ID, Details',
      KeyConditionExpression: '#T = :u',
      FilterExpression: '#R=:aa',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#ID': 'ID',
        '#R': 'PostApproval',
      },
      ExpressionAttributeValues: {
        ':u': 'reimbursement',
        ':aa': 'waiting',
      },
    };
    const data = await this.docClient.query(params).promise();
    console.log(data);
    if(data.Items) {
      return data.Items;
    }
    return [];
  }

  async getReimEmpApproval(userID:string): Promise<Reim[]> {
    const params = {
      TableName: 'Reimbursement',
      KeyConditionExpression: '#T = :u',
      FilterExpression: '#E=:a and #A=:p',
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

  async getReimGradeCheck(format:string) {
    const params = {
      TableName: 'Reimbursement',
      ProjectionExpression: '#ID, gradeSubmission, PassedOrNot, Details',
      KeyConditionExpression: '#T = :u',
      FilterExpression: '#G = :a and Details.GradingFormat=:f',
      ExpressionAttributeNames: {
        '#T': 'Thing',
        '#G': 'GradeCheck',
        '#ID': 'ID',
      },
      ExpressionAttributeValues: {
        ':u': 'reimbursement',
        ':a': 'waiting',
        ':f': format,
      },
    };
    const data = await this.docClient.query(params).promise();
    if(data.Items) {
      return data.Items;
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

  async updateToWaiting(id:string, who:string): Promise<void> {
    const params = {
      TableName: 'Reimbursement',
      Key: {
        'Thing': 'reimbursement',
        'ID': id,
      },
      UpdateExpression: 'set #W=:c',
      ExpressionAttributeNames: {
        '#W': who,
      },
      ExpressionAttributeValues: {
        ':c': 'waiting',
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
}

export default new UserDao();
