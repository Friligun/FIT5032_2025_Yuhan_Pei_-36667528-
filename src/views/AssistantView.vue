<template>
  <div class="container py-4 py-md-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <p class="text-uppercase text-primary small fw-bold mb-1">Guided health resources</p>
        <h1>Resource assistant</h1>
        <p class="text-muted">Ask where to start. This assistant shares general information and points you to HealthBridge resources; it does not diagnose conditions.</p>
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <label for="assistant-question" class="form-label">What would you like help finding?</label>
            <textarea id="assistant-question" v-model="question" class="form-control" rows="4" maxlength="500" placeholder="For example: How can I improve my sleep?"></textarea>
            <div class="d-flex justify-content-between align-items-center mt-3 gap-2">
              <span class="small text-muted">{{ question.length }}/500</span>
              <button class="btn btn-primary" type="button" :disabled="loading || !question.trim()" @click="ask">{{ loading ? 'Checking resources…' : 'Ask assistant' }}</button>
            </div>
            <div v-if="answer" class="alert alert-light border mt-4 mb-0" role="status"><strong>HealthBridge assistant</strong><p class="mb-0 mt-2">{{ answer }}</p></div>
            <p class="small text-muted mt-3 mb-0">For urgent symptoms, call emergency services. Always confirm health decisions with a qualified professional.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { askHealthAssistant } from '../services/cloud'
const question = ref('')
const answer = ref('')
const loading = ref(false)
async function ask() {
  loading.value = true
  try { answer.value = (await askHealthAssistant(question.value.trim())).answer || 'No answer was returned.' } catch { answer.value = 'The assistant is temporarily unavailable. Please browse Health Resources or contact our team.' } finally { loading.value = false }
}
</script>
