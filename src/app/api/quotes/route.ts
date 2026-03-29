import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // In production, you would save this to Payload CMS
    // For now, we'll just log and return success
    console.log('New quote request:', data)
    
    // TODO: Add email notification
    // TODO: Save to Payload CMS quotes collection
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quote request received!' 
    })
  } catch (error) {
    console.error('Error processing quote:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process quote request' },
      { status: 500 }
    )
  }
}
