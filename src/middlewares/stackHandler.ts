import { NextMiddleware, NextResponse } from 'next/server'
import { MiddlewareFactory } from '../app/interfaces/middleFactory.interface'

/**
 * Composes an array of middleware functions into a single function.
 * Each middleware function is called with a `next` function as its argument.
 * The `next` function is a callback that, when invoked, executes the next middleware in the stack.
 * If the `next` function is not called, the request will not proceed to the next middleware in the stack.
 * If there are no more middleware functions in the stack, the request will be handled by a default function that simply calls `NextResponse.next()`.
 * @param functions An array of middleware functions to compose.
 * @param index The index of the current middleware function being executed.
 * @returns A function that represents the composed middleware stack.
 */
export function stackMiddlewares(
  functions: MiddlewareFactory[] = [],
  index = 0
): NextMiddleware {
  const current = functions[index]
  if (current) {
    const next = stackMiddlewares(functions, index + 1)
    return current(next)
  }
  return () => NextResponse.next()
}
