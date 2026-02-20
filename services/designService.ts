import { ColorPalette, MoodBoardItem, DesignStyle, AiRenderResult } from '../types';
import { sendMessageToAria } from './geminiService';

export const MOCK_PALETTES: ColorPalette[] = [
  { id: 'p1', name: 'Sunset Romance', colors: ['#FF7F50', '#FFD700', '#FFDAB9', '#FFF5EE', '#2F4F4F'], tags: ['Warm', 'Summer'] },
  { id: 'p2', name: 'Sage & Cream', colors: ['#8FBC8F', '#F5F5DC', '#D2B48C', '#FFFFFF', '#556B2F'], tags: ['Nature', 'Rustic'] },
  { id: 'p3', name: 'Midnight Glamour', colors: ['#191970', '#C0C0C0', '#000000', '#4B0082', '#F8F8FF'], tags: ['Luxury', 'Winter'] },
  { id: 'p4', name: 'Blush & Gold', colors: ['#FFB6C1', '#D4AF37', '#FFF0F5', '#E6E6FA', '#808080'], tags: ['Classic', 'Romantic'] },
  { id: 'p5', name: 'Terracotta Earth', colors: ['#E2725B', '#A0522D', '#DEB887', '#FAEBD7', '#8B4513'], tags: ['Bohemian', 'Fall'] },
];

export const MOCK_MOOD_BOARD: MoodBoardItem[] = [
  { id: 'm1', category: 'Ceremony', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', likes: 2, note: 'Love this arch!' },
  { id: 'm2', category: 'Reception', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=800&q=80', likes: 1, note: 'Table setting idea' },
  { id: 'm3', category: 'Flowers', imageUrl: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&w=800&q=80', likes: 3 },
  { id: 'm4', category: 'Cake', imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80', likes: 0 },
  { id: 'm5', category: 'Attire', imageUrl: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80', likes: 5, note: 'Dress style' },
];

// Map styles to Unsplash keywords for simulation
const STYLE_KEYWORDS: Record<DesignStyle, string> = {
  'Bohemian': 'boho wedding',
  'Classic': 'classic white wedding',
  'Modern': 'modern minimalist wedding',
  'Rustic': 'rustic barn wedding',
  'Luxury': 'luxury glamorous wedding',
  'Garden': 'botanical garden wedding'
};

export const generateAiRender = async (
  originalUrl: string, 
  style: DesignStyle, 
  paletteId: string
): Promise<AiRenderResult> => {
  // Simulate AI Processing Delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // In a real app, this would call Stable Diffusion / DALL-E
  // Here we simulate by returning a relevant Unsplash image based on style
  const keyword = STYLE_KEYWORDS[style];
  const mockRenderUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)}`; 
  // Note: source.unsplash is deprecated/unreliable, using picsum with seed/keywords for mock if needed, 
  // but let's try a specific logic or randomizer. 
  // Better approach for reliable mock:
  const mockImages: Record<DesignStyle, string> = {
    'Bohemian': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    'Classic': 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=800&q=80',
    'Modern': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
    'Rustic': 'https://images.unsplash.com/photo-1510924199351-4e9d94df18a6?auto=format&fit=crop&w=800&q=80',
    'Luxury': 'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?auto=format&fit=crop&w=800&q=80',
    'Garden': 'https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=800&q=80'
  };

  const paletteName = MOCK_PALETTES.find(p => p.id === paletteId)?.name || 'Custom';

  return {
    id: `render-${Date.now()}`,
    originalUrl,
    renderedUrl: mockImages[style],
    style,
    paletteName,
    createdAt: new Date().toISOString()
  };
};

export const generatePaletteFromAI = async (prompt: string): Promise<ColorPalette> => {
    // Call Aria/Gemini to get hex codes based on description
    try {
        const response = await sendMessageToAria(
            `Generate a JSON object for a wedding color palette based on this vibe: "${prompt}". 
            Format: { "name": "Creative Name", "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"], "tags": ["Tag1", "Tag2"] }. 
            Only return the JSON.`
        );
        
        // Naive parsing for demo purposes
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                id: `p-${Date.now()}`,
                name: parsed.name,
                colors: parsed.colors,
                tags: parsed.tags
            };
        }
    } catch (e) {
        console.error("AI Palette Generation Failed", e);
    }

    // Fallback if AI fails
    return {
        id: `p-${Date.now()}`,
        name: 'AI Generated (Fallback)',
        colors: ['#CCCCCC', '#999999', '#666666', '#333333', '#000000'],
        tags: ['Custom']
    };
};
