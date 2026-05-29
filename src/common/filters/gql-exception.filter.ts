import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, _host: ArgumentsHost) {
    const status = exception.getStatus();
    const response = exception.getResponse();
    const message =
      typeof response === 'object' && 'message' in response
        ? (response as any).message
        : exception.message;

    // Handle array of errors (e.g. from ValidationPipe)
    const formattedMessage = Array.isArray(message)
      ? message.join(', ')
      : message;

    const graphQlCode =
      status === HttpStatus.UNAUTHORIZED ? 'UNAUTHENTICATED' : String(status);

    return new GraphQLError(formattedMessage, {
      extensions: {
        code: graphQlCode,
        http: { status: status },
        originalError: response,
      },
    });
  }
}
