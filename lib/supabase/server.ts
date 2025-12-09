import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a mock client during build if env vars are missing
    const createMockQuery = () => {
      const result = Promise.resolve({ data: [], error: null })
      const mockQuery: any = {
        eq: () => mockQuery,
        order: () => result,
        limit: () => result,
        single: async () => ({ data: null, error: null }),
      }
      // Make the query builder thenable
      Object.setPrototypeOf(mockQuery, Promise.prototype)
      mockQuery.then = result.then.bind(result)
      mockQuery.catch = result.catch.bind(result)
      mockQuery.finally = result.finally.bind(result)
      return mockQuery
    }
    
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        select: () => createMockQuery(),
        insert: () => ({ data: null, error: null }),
        update: () => createMockQuery(),
        delete: () => createMockQuery(),
      }),
    } as any
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

