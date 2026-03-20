import { NextFunction, Request, Response } from "express";

import { supabase } from "../config/supabase";

export type AuthenticatedUser = {
  id: string;
  email?: string;
};

function getBearerToken(headerValue?: string): string | null {
  if (!headerValue) {
    return null;
  }

  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!supabase) {
    return res.status(503).json({ error: "Authentication is unavailable" });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  req.user = {
    id: data.user.id,
    email: data.user.email,
  };

  return next();
}
