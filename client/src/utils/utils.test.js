import { describe, it, expect } from 'vitest'
import { findFullLines, getNewGrid } from '../utils'

describe('findFullLines', () => {

    it('retourne [] si aucune ligne pleine', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(findFullLines(grid)).toEqual([])
    })

	it('retourne [index] si une ligne est pleine', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[19] = Array(10).fill(1)
        expect(findFullLines(grid)).toEqual([19])
    })

	it('retourne plusieurs indices si plusieurs lignes pleines', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[18] = Array(10).fill(1)
        grid[19] = Array(10).fill(1)
        expect(findFullLines(grid)).toEqual([18, 19])
    })
})

describe('getNewGrid', () => {

	it('retourne une nouvelle grille sans les lignes pleines', () => {
    	const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
   		grid[19] = Array(10).fill(1)
		const result = getNewGrid(grid, [19], 10)
		expect(result[19]).toEqual(Array(10).fill(0))
		expect(result.length).toBe(20)
	})
})