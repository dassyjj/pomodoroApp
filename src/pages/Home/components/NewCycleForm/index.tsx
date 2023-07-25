import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

export function NewCycleForm() {
  return (
    <FormContainer>
      <label htmlFor="task">I will work on</label>
      <TaskInput id="task" disabled={disableWhenActiveCycle} list="task-suggestions" placeholder="add project name" {...register('task')} />

      <datalist id="task-suggestions">
        <option value="Project 1" />
        <option value="Project 1" />
        <option value="Project 1" />
        <option value="Banana" />
      </datalist>

      <label htmlFor="minutesAmount">during</label>
      <MinutesAmountInput type="number" id="minutesAmount" disabled={disableWhenActiveCycle} placeholder="00" {...register('minutesAmount', { valueAsNumber: true })} step={5} min={1} max={60} />

      <span>minutes.</span>
    </FormContainer>
  )
}