import { GoogleGenAI, Type } from "@google/genai";
import type { MusicIdeas, SubmissionData, LyricAnalysis } from '../types';

export const generateMusicIdeas = async (submissionData: SubmissionData): Promise<MusicIdeas | null> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const { genre, vocalist, songStructure, vocalStyle, lyrics } = submissionData;

    const prompt = `
      Analyze the following lyrics for a song. The artist wants a "${genre}" genre song.
      The desired vocalist is ${vocalist}.
      The preferred song structure is "${songStructure}".
      The preferred vocal style is "${vocalStyle}".

      Based on the mood and themes in the lyrics, generate creative ideas for the music production.
      Provide suggestions for the overall mood, key instruments, a potential chord progression, a suitable tempo in BPM, and a suggested vocal style that complements the artist's preference.
      The lyrics can be in any language; analyze them based on their phonetic and emotional content if the language is unknown.

      Lyrics: """${lyrics}"""
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        mood: {
          type: Type.STRING,
          description: "A brief description of the song's mood or vibe.",
        },
        instrumentation: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "A list of 3-5 suggested instruments.",
        },
        chordProgression: {
          type: Type.STRING,
          description: 'A simple, common chord progression that fits the mood (e.g., "C - G - Am - F").',
        },
        tempo: {
          type: Type.NUMBER,
          description: "A suggested tempo in beats per minute (BPM).",
        },
        vocalStyleSuggestion: {
          type: Type.STRING,
          description: "A suggested vocal delivery style that fits the song and complements the artist's preference."
        }
      },
      required: ["mood", "instrumentation", "chordProgression", "tempo", "vocalStyleSuggestion"],
    };

    const genAIResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = genAIResponse.text.trim();
    const ideas: MusicIdeas = JSON.parse(jsonText);
    
    return ideas;

  } catch (error) {
    console.error("Error generating music ideas:", error);
    return null;
  }
};

export const analyzeLyrics = async (lyrics: string): Promise<LyricAnalysis | null> => {
  try {
     if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Analyze the following song lyrics. Provide a brief analysis of the overall sentiment and the most likely rhyme scheme.
      Sentiment should be a single descriptive word (e.g., Joyful, Melancholy, Aggressive, Hopeful).
      Rhyme scheme should be in standard notation (e.g., AABB, ABAB, Free Verse).

      Lyrics: """${lyrics}"""
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        sentiment: {
          type: Type.STRING,
          description: "The overall sentiment of the lyrics.",
        },
        rhymeScheme: {
          type: Type.STRING,
          description: "The identified rhyme scheme of the lyrics.",
        },
      },
      required: ["sentiment", "rhymeScheme"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const analysis: LyricAnalysis = JSON.parse(jsonText);
    return analysis;

  } catch(error) {
    console.error("Error analyzing lyrics:", error);
    return null;
  }
};
