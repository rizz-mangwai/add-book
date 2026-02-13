import { describe, it, expect } from 'vitest';
import { Place } from '../../src/domain/Place.js';

describe('Place entity', () => {
  it('creates a place with required name', () => {
    const place = new Place({ name: 'Kyoto' });
    expect(place.name).toBe('Kyoto');
    expect(place.id).toBeDefined();
    expect(typeof place.id).toBe('string');
    expect(place.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it('throws when name is missing or empty', () => {
    expect(() => new Place({})).toThrow(/name is required/);
    expect(() => new Place({ name: '   ' })).toThrow(/name is required/);
  });

  it('trims string fields', () => {
    const place = new Place({
      name: '  Tokyo  ',
      country: ' japan ',
      visit: ' spring   2024 ',
    });
    expect(place.name).toBe('Tokyo');
    expect(place.country).toBe('japan');
    expect(place.visit).toBe('spring   2024');
  });

  it('provides displayName combining name and country', () => {
    const p1 = new Place({ name: 'Paris', country: 'France' });
    const p2 = new Place({ name: 'Nairobi' });

    expect(p1.displayName).toBe('Paris (France)');
    expect(p2.displayName).toBe('Nairobi');
  });

  it('serializes to JSON without methods', () => {
    const place = new Place({
      name: 'Barcelona',
      country: 'Spain',
      visit: 'Summer 2023',
      landmarks: 'Sagrada Família\nPark Güell',
      notes: 'Amazing food\n★ ★ ★ ★ ½',
    });

    const json = place.toJSON();
    expect(json).toEqual({
      id: expect.any(String),
      name: 'Barcelona',
      country: 'Spain',
      visit: 'Summer 2023',
      landmarks: 'Sagrada Família\nPark Güell',
      notes: 'Amazing food\n★ ★ ★ ★ ½',
      createdAt: expect.any(String),
    });
    expect(json).not.toHaveProperty('displayName');
  });

  it('can be reconstructed from JSON', () => {
    const original = new Place({ name: 'Cape Town', country: 'South Africa' });
    const json = original.toJSON();
    const restored = Place.fromJSON(json);

    expect(restored instanceof Place).toBe(true);
    expect(restored.name).toBe('Cape Town');
    expect(restored.displayName).toBe('Cape Town (South Africa)');
  });
});