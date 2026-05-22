import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

interface LogoGenerationParams {
  companyName: string
  industry: string
  style: string
  colors: string[]
  personality: string[]
}

export async function generateLogo(params: LogoGenerationParams): Promise<string[]> {
  const prompt = buildLogoPrompt(params)

  const variants: string[] = []

  const styles = [
    `${prompt}, minimalist vector style, clean lines`,
    `${prompt}, modern geometric design, bold typography`,
    `${prompt}, professional corporate style, elegant`,
  ]

  for (const stylePrompt of styles) {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: stylePrompt,
          aspect_ratio: '1:1',
          num_outputs: 1,
          output_format: 'png',
          output_quality: 90,
        },
      }
    )

    const urls = output as string[]
    if (urls && urls[0]) variants.push(urls[0])
  }

  return variants
}

function buildLogoPrompt(params: LogoGenerationParams): string {
  const colorStr = params.colors.slice(0, 2).join(' and ')
  const personalityStr = params.personality.slice(0, 3).join(', ')

  return [
    `Professional logo for "${params.companyName}"`,
    `${params.industry} industry`,
    `brand personality: ${personalityStr}`,
    colorStr ? `color palette: ${colorStr}` : '',
    'white background, high quality, vector art style',
    'no text, symbol/icon only',
  ].filter(Boolean).join(', ')
}
