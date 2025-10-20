const { validationResult } = require('express-validator');
const { validateRequest } = require('../../../middleware/validateRequest.js');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

const mockValidationResult = validationResult;

describe('Middleware: validateRequest', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(() => mockResponse),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 400 and formatted errors if validation fails', () => {
    const mockErrors = [
      { type: 'field', msg: 'Invalid email', path: 'email', location: 'body' },
      {
        type: 'field',
        msg: 'Password is required',
        path: 'password',
        location: 'body',
      },
    ];

    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrors,
    });

    validateRequest(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    const expectedErrorResponse = {
      errors: [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password is required' },
      ],
    };
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedErrorResponse);
  });

  it('should call next() if validation passes', () => {
    mockValidationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    validateRequest(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
