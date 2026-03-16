import { Injectable, signal, computed, effect, WritableSignal, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { CartItem, Product } from '../models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private client: SupabaseClient;
  private userSignal: WritableSignal<User | null> = signal<User | null>(null);
  
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    this.client = this.supabaseService.supabase;
    
    this.client.auth.onAuthStateChange((event, session) => {
      this.userSignal.set(session?.user ?? null);
    });
  }

  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  }

  async signUp(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.client.auth.signUp({
      email,
      password
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
    this.userSignal.set(null);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
