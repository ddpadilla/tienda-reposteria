import { Injectable, signal, computed, effect, WritableSignal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private client: SupabaseClient;
  private userSignal: WritableSignal<User | null> = signal<User | null>(null);
  
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    this.client = createClient(
      'https://lpooruluvctjaqrexsee.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwb29ydWx1dmN0amFxcmV4c2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTIzMDgsImV4cCI6MjA4OTE2ODMwOH0.GbT-TAS3t84kTd17hGHOZLcyWL07DdPSMgbfQGrWHsg'
    );
    
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
