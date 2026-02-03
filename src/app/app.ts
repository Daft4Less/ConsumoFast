import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Persona, GestionPersonasService } from './persona.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  personas: Persona[] = [];
  personaForm: FormGroup;
  editingCedula: string | null = null;

  constructor(
    private personaService: GestionPersonasService,
    private fb: FormBuilder
  ) {
    this.personaForm = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPersonas();
  }

  loadPersonas(): void {
    this.personaService.getPersonas().subscribe((data: Persona[]) => {
      this.personas = data;
    });
  }

  onSubmit(): void {
    if (this.personaForm.valid) {
      if (this.editingCedula) {
        const persona: Persona = {
          cedula: this.editingCedula,
          nombre: this.personaForm.value.nombre,
          direccion: this.personaForm.value.direccion
        };
        // Update existing persona
        this.personaService.updatePersona(persona).subscribe(() => {
          this.loadPersonas();
          this.resetForm();
        });
      } else {
        // Create new persona
        this.personaService.createPersona(this.personaForm.value).subscribe(() => {
          this.loadPersonas();
          this.resetForm();
        });
      }
    }
  }

  editPersona(persona: Persona): void {
    this.editingCedula = persona.cedula;
    this.personaForm.setValue({
      cedula: persona.cedula,
      nombre: persona.nombre,
      direccion: persona.direccion
    });
    this.personaForm.get('cedula')?.disable(); // Disable cedula editing
  }

  deletePersona(cedula: string): void {
    this.personaService.deletePersona(cedula).subscribe(() => {
      this.loadPersonas();
    });
  }

  resetForm(): void {
    this.personaForm.reset();
    this.personaForm.get('cedula')?.enable();
    this.editingCedula = null;
  }
}
