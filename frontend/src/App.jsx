import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { taskService } from '@/services/api';
import { Plus, Trash2, Check, Edit2, Loader2, AlertCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const isCompleted = filter === 'all' ? undefined : filter === 'completed';
      const response = await taskService.getAll(isCompleted);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setSubmitting(true);
      const response = await taskService.create(title);
      setTasks([response.data, ...tasks]);
      setTitle('');
      toast.success('Task added');
      setError(null);
    } catch {
      toast.error('Failed to create task');
      setError('Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await taskService.update(id, { completed: !completed });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
      toast.success(!completed ? 'Marked complete' : 'Marked pending');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return setEditingId(null);
    try {
      const response = await taskService.update(id, { title: editText });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
      setEditingId(null);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.error('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-white py-14 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">TaskFlow</h1>
          <p className="text-sm text-zinc-400 mt-1">Stay on top of your work</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2.5 mb-6">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            className="flex-1 h-11 px-4 text-sm border border-zinc-200 rounded-lg bg-white text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors"
          />
          <Button
            type="submit"
            disabled={submitting || !title.trim()}
            className="h-11 px-5 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>Add</span>
          </Button>
        </form>

        <div className="flex gap-1.5 mb-6 p-1 bg-zinc-100 rounded-lg border border-zinc-200">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex-1 h-8 text-xs font-medium rounded-md capitalize cursor-pointer transition-all',
                filter === f
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 cursor-pointer font-bold leading-none">×</button>
          </div>
        )}

        <div className="space-y-2">
          {loading ? (
            <div className="py-16 flex flex-col items-center text-zinc-400">
              <Loader2 className="h-7 w-7 animate-spin mb-3" />
              <p className="text-sm">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-14 text-center border-2 border-dashed border-zinc-200 rounded-xl">
              <ClipboardList className="mx-auto h-10 w-10 text-zinc-300 mb-3" />
              <p className="text-sm font-medium text-zinc-500">No tasks yet</p>
              <p className="text-xs text-zinc-400 mt-1">
                {filter === 'all' ? 'Add one above to get started.' : `No ${filter} tasks found.`}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3.5 bg-white border rounded-lg transition-all duration-150',
                  task.completed
                    ? 'border-zinc-100 opacity-60'
                    : 'border-zinc-200 hover:border-zinc-400 hover:-translate-y-px'
                )}
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={cn(
                    'w-4.5 h-4.5 rounded-lg border-[1.5px] flex items-center justify-center shrink-0 cursor-pointer transition-colors',
                    task.completed
                      ? 'bg-zinc-950 border-zinc-950'
                      : 'border-zinc-300 hover:border-zinc-900'
                  )}
                >
                  {task.completed && <Check className="h-2.5 w-2.5 text-white stroke-3" />}
                </button>

                {editingId === task.id ? (
                  <Input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 h-8 px-2.5 text-sm border border-zinc-900 rounded-md focus-visible:ring-0"
                  />
                ) : (
                  <span
                    onClick={() => !task.completed && startEdit(task)}
                    className={cn(
                      'flex-1 text-sm transition-colors',
                      task.completed
                        ? 'line-through text-zinc-400 cursor-default'
                        : 'text-zinc-800 cursor-pointer hover:text-zinc-950'
                    )}
                  >
                    {task.title}
                  </span>
                )}

                <span className="text-[11px] text-zinc-400 font-mono hidden sm:block whitespace-nowrap">
                  {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!task.completed && editingId !== task.id && (
                    <button
                      onClick={() => startEdit(task)}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && total > 0 && (
          <div className="mt-6 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-zinc-500 font-medium">
                {pending} task{pending !== 1 ? 's' : ''} remaining
              </span>
              <div className="flex gap-3 text-xs text-zinc-400">
                <span>Total <strong className="text-zinc-700">{total}</strong></span>
                <span>Done <strong className="text-zinc-700">{completed}</strong></span>
                <span>Pending <strong className="text-zinc-700">{pending}</strong></span>
              </div>
            </div>
            <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-950 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;