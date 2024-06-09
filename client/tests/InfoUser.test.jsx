import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { API_URL } from '../src/App';
import InfoUserAdmin from '../src/components/admins/InfoUserAdmin';


vi.mock('../../auth/AuthProvider', () => ({
  useAuth: () => ({
    getUser: () => ({ id_usuario: 1 }),
  }),
}))

vi.mock('../../App', () => ({
  API_URL: 'http://mock-api.com',
}))

vi.mock("react-icons/lu", () => ({
  LuUser: () => <span>LuUserIcon</span>,
  LuCalendarDays: () => <span>LuCalendarDaysIcon</span>,
  LuBedDouble: () => <span>LuBedDoubleIcon</span>,
}))

vi.mock("react-icons/fi", () => ({
  FiHome: () => <span>FiHomeIcon</span>,
}))

vi.mock("react-icons/md", () => ({
  MdFaceUnlock: () => <span>MdFaceUnlockIcon</span>,
  MdOutlineNotInterested: () => <span>MdOutlineNotInterestedIcon</span>,
  MdOutlineEdit: () => <span>MdOutlineEditIcon</span>,
}))

vi.mock("react-icons/fa", () => ({
  FaRegAddressCard: () => <span>FaRegAddressCardIcon</span>,
}))

vi.mock("react-icons/ri", () => ({
  RiHospitalLine: () => <span>RiHospitalLineIcon</span>,
}))

vi.mock("react-icons/lia", () => ({
  LiaCoinsSolid: () => <span>LiaCoinsSolidIcon</span>,
}))

vi.mock("react-icons/pi", () => ({
  PiGenderIntersexLight: () => <span>PiGenderIntersexLightIcon</span>,
}))

global.fetch = vi.fn((url) => {
  if (url.includes('/infouser')) {
    return Promise.resolve({
      json: () => Promise.resolve([{ admin: true }]),
    })
  }
  if (url.includes('/clienteInfo')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        nombre_c: 'John',
        apellidos_c: 'Doe',
        fecha_i: '2023-06-04T12:34:56Z',
        lugar_o: 'Some Place',
        nombre_p: 'Jane',
        apellidos_p: 'Doe',
        carnet: '12345678',
        nombre_a: 'Some Hospital',
        nivel_se: 2,
        notas_c: 'Some notes',
        sexo: true,
      }),
    })
  }
  if (url.includes('/huespedInfo')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        id_cama: 1,
        fecha_i: '2023-06-04T12:34:56Z',
      }),
    })
  }
  if (url.includes('/deudaCliente')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        deudacliente: -50,
      }),
    })
  }
  if (url.includes('/servicioEU')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        servicio1: 1,
        servicio2: 1,
        servicio3: 1,
        servicio4: 1,
        servicio5: 1,
      }),
    })
  }
  if (url.includes('/tipoCliente')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        tipo_cliente: true,
      }),
    })
  }
  if (url.includes('/vetado')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        vetadobool: 'true',
      }),
    })
  }
  if (url.includes('/notasVeto')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        notas_v: '',
      }),
    })
  }
  return Promise.reject(new Error('Invalid API endpoint'))
})

describe('InfoUserAdmin Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('Render del componente', async () => {
    render(
      <BrowserRouter>
        <InfoUserAdmin id_cliente={1} />
      </BrowserRouter>
    )

    expect(screen.getByText(/Información del Paciente/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/Some Place/i)).toBeInTheDocument()
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument()
      expect(screen.getByText(/12345678/i)).toBeInTheDocument()
      expect(screen.getByText(/Some Hospital/i)).toBeInTheDocument()
      expect(screen.getByText(/Nivel socioeconómico/i)).toBeInTheDocument()
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
      expect(screen.getByText(/Hombre/i)).toBeInTheDocument()
      expect(screen.getByText(/Some notes/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('$50')).toBeInTheDocument()
      expect(screen.getByText(/Cama: 1/i)).toBeInTheDocument()
      expect(screen.getByText(/Usuario Vetado/i)).toBeInTheDocument()
    })
  })

  it('Manejo de pago', async () => {
    render(
      <BrowserRouter>
        <InfoUserAdmin id_cliente={1} />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText('$0')
    fireEvent.change(input, { target: { value: '30' } })
    
    await waitFor(() => {
      expect(input.value).toBe('30')
    })

    const button = screen.getByText(/Abonar/i)
    fireEvent.click(button)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/registrarPago`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ id_cliente: 1, pago: '30' }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
        })
      )
    })
  })
})
