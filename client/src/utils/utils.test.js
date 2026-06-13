import { describe, it, expect } from 'vitest'
import { findFullLines, getNewGrid, hasCollisionBelow, canPieceMoveTo, canRotate, dropPiece, handleKeyPress, getSpectrum, addPenaltyLines, getGhostRow } from '../utils'
import { matrix } from '../pieces'

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

describe('hasCollisionBelow', () => {
    it('retourne false si rien en dessous', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const shape = [[1, 1], [1, 1]]
        expect(hasCollisionBelow(shape, 0, 0, grid, 10, 20)).toBe(false)
    })
    
    it('retourne true si la piece touche le sol', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const shape = [[1, 1], [1, 1]]
        expect(hasCollisionBelow(shape, 0, 18, grid, 10, 20)).toBe(true)
    })

    it('retourne true si un bloc est en dessous', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[5] = Array(10).fill(1)
        const shape = [[1, 1]]
        expect(hasCollisionBelow(shape, 0, 4, grid, 10, 20)).toBe(true)
    })
})

describe('canPieceMoveTo', () => {
    it('retourne true si la piece peut se deplacer', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(canPieceMoveTo('O', 0, 0, 0, grid, matrix, 10, 20)).toBe(true)
    })

    it('retourne false si la piece sort a droite', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(canPieceMoveTo('O', 0, 9, 0, grid, matrix, 10, 20)).toBe(false)
    })

    it('retourne false si un bloc occupe la position', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[0] = Array(10).fill(1)
        expect(canPieceMoveTo('O', 0, 0, 0, grid, matrix, 10, 20)).toBe(false)
    })
})

describe('canRotate', () => {
    it('retourne true si la rotation est possible', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(canRotate('T', 0, 0, 0, grid, matrix, 10, 20)).toBe(true)
    })

    it('retourne false si la rotation sort de la grille', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(canRotate('T', 0, 9, 0, grid, matrix, 10, 20)).toBe(false)
    })

    it('retourne false si un bloc bloque la rotation', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[1] = Array(10).fill(1)
        expect(canRotate('T', 0, 0, 0, grid, matrix, 10, 20)).toBe(false)
    })
})

describe('dropPiece', () => {
    it('retourne DROP si la piece peut descendre', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = dropPiece('O', 0, 0, 0, grid)
        expect(result.action).toBe('DROP')
    })

    it('retourne LOCK si la piece touche le sol', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = dropPiece('O', 0, 0, 18, grid)
        expect(result.action).toBe('LOCK')
    })

    it('retourne null si piece est null', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = dropPiece(null, 0, 0, 0, grid)
        expect(result).toBe(null)
    })
})

describe('handleKeyPress', () => {
    it('retourne null si piece est null', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = handleKeyPress('ArrowLeft', null, 0, 3, 0, false, grid, matrix, 10, 20)
        expect(result).toBe(null)
    })

    it('deplace la piece a gauche', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = handleKeyPress('ArrowLeft', 'O', 0, 3, 0, false, grid, matrix, 10, 20)
        expect(result.col).toBe(2)
    })

    it('deplace la piece a droite', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = handleKeyPress('ArrowRight', 'O', 0, 3, 0, false, grid, matrix, 10, 20)
        expect(result.col).toBe(4)
    })
})

describe('getSpectrum', () => {

    it('retourne 0 pour toutes les colonnes si la grille est vide', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(getSpectrum(grid)).toEqual(Array(10).fill(0))
    })

    it('retourne la hauteur correcte pour une colonne occupee', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[19][0] = 1
        expect(getSpectrum(grid)[0]).toBe(1)
    })

    it('calcule la hauteur a partir du premier bloc rencontre', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[15][2] = 1
        expect(getSpectrum(grid)[2]).toBe(5)
    })
})

describe('addPenaltyLines', () => {

    it('ajoute des lignes P en bas de la grille', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = addPenaltyLines(grid, 2, 10)
        expect(result[18]).toEqual(Array(10).fill('P'))
        expect(result[19]).toEqual(Array(10).fill('P'))
    })

    it('garde une grille de la meme hauteur', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        const result = addPenaltyLines(grid, 2, 10)
        expect(result.length).toBe(20)
    })

    it('retire le meme nombre de lignes en haut', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[0] = Array(10).fill(1)
        const result = addPenaltyLines(grid, 1, 10)
        expect(result[0]).toEqual(Array(10).fill(0))
    })
})

describe('getGhostRow', () => {

    it('retourne la ligne du bas si la grille est vide', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(getGhostRow('O', 0, 0, 0, grid, matrix, 10, 20)).toBe(18)
    })

    it('s\'arrete juste au dessus d\'un bloc existant', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        grid[19] = Array(10).fill(1)
        expect(getGhostRow('O', 0, 0, 0, grid, matrix, 10, 20)).toBe(17)
    })

    it('ne bouge pas si la piece est deja posee au sol', () => {
        const grid = Array.from({ length: 20 }, () => Array(10).fill(0))
        expect(getGhostRow('O', 0, 0, 18, grid, matrix, 10, 20)).toBe(18)
    })
})