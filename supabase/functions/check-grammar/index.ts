import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GrammarCheckRequest {
  text: string;
  language?: string;
}

interface GrammarIssue {
  message: string;
  suggestion: string;
  severity: 'error' | 'warning' | 'info';
  offset: number;
  length: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'en-US' }: GrammarCheckRequest = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKey = Deno.env.get('LANGUAGETOOL_API_KEY');
    const apiUrl = apiKey 
      ? 'https://api.languagetoolplus.com/v2/check'
      : 'https://api.languagetool.org/v2/check';

    const params = new URLSearchParams({
      text,
      language,
      enabledOnly: 'false',
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LanguageTool API error:', response.status, errorText);
      throw new Error(`LanguageTool API error: ${response.status}`);
    }

    const data = await response.json();
    
    const issues: GrammarIssue[] = data.matches.map((match: any) => ({
      message: match.message,
      suggestion: match.replacements?.[0]?.value || '',
      severity: match.rule.issueType === 'misspelling' ? 'error' : 
                match.rule.issueType === 'grammar' ? 'warning' : 'info',
      offset: match.offset,
      length: match.length,
    }));

    // Apply corrections automatically
    let correctedText = text;
    const sortedIssues = [...data.matches].sort((a: any, b: any) => b.offset - a.offset);
    
    for (const match of sortedIssues) {
      if (match.replacements?.[0]?.value) {
        const before = correctedText.substring(0, match.offset);
        const after = correctedText.substring(match.offset + match.length);
        correctedText = before + match.replacements[0].value + after;
      }
    }

    return new Response(
      JSON.stringify({
        issues,
        correctedText: issues.length > 0 ? correctedText : text,
        originalText: text,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Grammar check error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
