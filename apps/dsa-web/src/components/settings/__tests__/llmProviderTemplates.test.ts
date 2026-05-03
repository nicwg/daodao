import { describe, expect, it } from 'vitest';
import {
  LLM_PROVIDER_TEMPLATE_BY_ID,
  LLM_PROVIDER_TEMPLATES,
  MODEL_PLACEHOLDERS_BY_PROTOCOL,
} from '../llmProviderTemplates';

describe('llmProviderTemplates', () => {
  it('keeps provider template order aligned with the existing preset dropdown order', () => {
    expect(LLM_PROVIDER_TEMPLATES.map((template) => template.channelId)).toEqual([
      'aihubmix',
      'deepseek',
      'dashscope',
      'zhipu',
      'moonshot',
      'minimax',
      'volcengine',
      'siliconflow',
      'openrouter',
      'gemini',
      'anthropic',
      'openai',
      'ollama',
      'custom',
    ]);
  });

  it('derives lookup keys from unique channel ids', () => {
    const channelIds = LLM_PROVIDER_TEMPLATES.map((template) => template.channelId);

    expect(new Set(channelIds).size).toBe(channelIds.length);
    for (const template of LLM_PROVIDER_TEMPLATES) {
      expect(LLM_PROVIDER_TEMPLATE_BY_ID[template.channelId]).toBe(template);
    }
  });

  it('uses volcengine as the default Volcengine Ark provider id', () => {
    expect(LLM_PROVIDER_TEMPLATE_BY_ID.volcengine).toMatchObject({
      label: '火山方舟（豆包）',
      protocol: 'openai',
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
      placeholderModels: 'doubao-seed-1-6-251015,doubao-seed-1-6-thinking-251015',
    });
    expect(LLM_PROVIDER_TEMPLATE_BY_ID.ark).toBeUndefined();
  });

  it('keeps basic metadata on non-custom provider templates', () => {
    for (const template of LLM_PROVIDER_TEMPLATES.filter((item) => item.channelId !== 'custom')) {
      expect(template.capabilities.length).toBeGreaterThan(0);
      expect(template.officialSources.length).toBeGreaterThan(0);
    }
  });

  it('keeps protocol-level fallback placeholders centralized', () => {
    expect(MODEL_PLACEHOLDERS_BY_PROTOCOL).toMatchObject({
      openai: 'gpt-5.5,qwen3.6-plus',
      deepseek: 'deepseek-v4-flash,deepseek-v4-pro',
      gemini: 'gemini-3.1-pro-preview,gemini-3-flash-preview',
      anthropic: 'claude-sonnet-4-6,claude-opus-4-7',
      vertex_ai: 'gemini-3.1-pro-preview',
      ollama: 'llama3.2,qwen2.5',
    });
  });
});
