import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, content: ExecutionContext) => {
    return 'Hi there';
  },
);
