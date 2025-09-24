import { NextRequest } from 'next/server'
import { supabase } from './supabase'

// IP使用统计接口
export interface IPUsage {
  ip: string
  date: string
  count: number
  created_at: string
  updated_at: string
}

// 用户使用统计接口
export interface UserUsage {
  email: string
  date: string
  count: number
  created_at: string
  updated_at: string
}

// 获取客户端IP地址
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('x-vercel-forwarded-for')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (remoteAddr) {
    return remoteAddr.split(',')[0].trim()
  }
  return '127.0.0.1' // 默认IP
}

// 检查IP每日使用限制
export async function checkIPDailyLimit(ip: string): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD格式
  const limit = 5
  
  try {
    // 查询今日该IP的使用次数
    const { data: usage, error } = await supabase
      .from('ip_usage')
      .select('count')
      .eq('ip', ip)
      .eq('date', today)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 表示没有找到记录
      console.error('Error checking IP usage:', error)
      return { allowed: true, currentCount: 0, limit } // 出错时允许使用
    }
    
    const currentCount = usage?.count || 0
    return {
      allowed: currentCount < limit,
      currentCount,
      limit
    }
  } catch (error) {
    console.error('Error in checkIPDailyLimit:', error)
    return { allowed: true, currentCount: 0, limit } // 出错时允许使用
  }
}

// 更新IP使用次数
export async function updateIPUsage(ip: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toISOString()
  
  try {
    // 尝试更新现有记录
    const { data: existingUsage, error: selectError } = await supabase
      .from('ip_usage')
      .select('count')
      .eq('ip', ip)
      .eq('date', today)
      .single()
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error selecting IP usage:', selectError)
      return
    }
    
    if (existingUsage) {
      // 更新现有记录
      const { error: updateError } = await supabase
        .from('ip_usage')
        .update({ 
          count: existingUsage.count + 1,
          updated_at: now
        })
        .eq('ip', ip)
        .eq('date', today)
      
      if (updateError) {
        console.error('Error updating IP usage:', updateError)
      }
    } else {
      // 创建新记录
      const { error: insertError } = await supabase
        .from('ip_usage')
        .insert({
          ip,
          date: today,
          count: 1,
          created_at: now,
          updated_at: now
        })
      
      if (insertError) {
        console.error('Error inserting IP usage:', insertError)
      }
    }
  } catch (error) {
    console.error('Error in updateIPUsage:', error)
  }
}

// 检查用户每日使用限制
export async function checkUserDailyLimit(email: string): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD格式
  const limit = 10 // 已登录用户每日限制10次
  
  try {
    // 查询今日该用户的使用次数
    const { data: usage, error } = await supabase
      .from('user_usage')
      .select('count')
      .eq('email', email)
      .eq('date', today)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 表示没有找到记录
      console.error('Error checking user usage:', error)
      return { allowed: true, currentCount: 0, limit } // 出错时允许使用
    }
    
    const currentCount = usage?.count || 0
    return {
      allowed: currentCount < limit,
      currentCount,
      limit
    }
  } catch (error) {
    console.error('Error in checkUserDailyLimit:', error)
    return { allowed: true, currentCount: 0, limit } // 出错时允许使用
  }
}

// 更新用户使用次数
export async function updateUserUsage(email: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toISOString()
  
  try {
    // 尝试更新现有记录
    const { data: existingUsage, error: selectError } = await supabase
      .from('user_usage')
      .select('count')
      .eq('email', email)
      .eq('date', today)
      .single()
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error selecting user usage:', selectError)
      return
    }
    
    if (existingUsage) {
      // 更新现有记录
      const { error: updateError } = await supabase
        .from('user_usage')
        .update({ 
          count: existingUsage.count + 1,
          updated_at: now
        })
        .eq('email', email)
        .eq('date', today)
      
      if (updateError) {
        console.error('Error updating user usage:', updateError)
      }
    } else {
      // 创建新记录
      const { error: insertError } = await supabase
        .from('user_usage')
        .insert({
          email,
          date: today,
          count: 1,
          created_at: now,
          updated_at: now
        })
      
      if (insertError) {
        console.error('Error inserting user usage:', insertError)
      }
    }
  } catch (error) {
    console.error('Error in updateUserUsage:', error)
  }
}