// import 'react-datepicker/dist/react-datepicker.css';

import { ErrorMessage } from '@hookform/error-message';
import { format } from 'date-fns';
import { en, sv } from 'date-fns/locale/';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useSWR from 'swr';

import { store } from '../lib/api/meal';
import fetcher from '../lib/utils/fetcher';
import Alert from './alert';
import Loading from './loading';
import styles from './meal-form.module.scss';

export default function MealForm() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(['common', 'glossary']);
  const { data, error } = useSWR(`${process.env.apiUrl}/dishes`, fetcher);
  const defaultValues = {
    date: Date.now(),
    type: { value: '3', label: t('glossary:dinner') },
    dish: '',
  };

  const {
    handleSubmit, reset, control, watch, formState: { errors },
  } = useForm({ defaultValues });

  const watchDate = watch('date');

  if (error) {
    return (
      <Alert type="danger">
        {t('cantload', { what: t('glossary:dish_plural') })}
        ...
      </Alert>
    );
  }
  if (!data) return <Loading />;

  const onSubmit = async (values) => {
    setLoading(true);
    if (Object.entries(errors).length !== 0) {
      return (
        <Alert error>
          Fel
          ...
        </Alert>
      );
    }
    try {
      const response = await store(
        new Date(values.date).toISOString(),
        values.type.value,
        values.dish.value,
      );
      if (response.status !== 201) {
        console.log(response.data.errors);
      }
      console.table(response.data.meal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <p className={styles.capitalizeFirst}>
        {format(watchDate || Date.now(), 'eeee', { locale: router.locale === 'en' ? en : sv })}
        {' '}
        {t('glossary:the')}
      </p>
      <label htmlFor="date" className="form-label visually-hidden">
        {t('date')}
      </label>
      <Controller
        control={control}
        name="date"
        rules={{
          required: true,
          valueAsDate: true,
        }}
        render={({ field }) => (
          <ReactDatePicker
            closeOnScroll
            // popperClassName="some-custom-class"
            popperPlacement="bottom-start"
            popperModifiers={{
              offset: {
                enabled: true,
                offset: '32px, 8px',
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: 'viewport',
              },
            }}
            locale={router.locale === 'en' ? en : sv}
            dateFormat="do LLLL"
            className="w-100"
            placeholderText="Select date"
            onChange={(e) => field.onChange(e)}
            selected={field.value}
          />
        )}
      />
      <ErrorMessage errors={errors} name="date" />
      <p className="pt-2">
        {watchDate > defaultValues.date
          ? t('glossary:toeat')
          : t('glossary:eaten')}
      </p>
      <label htmlFor="dish" className="form-label visually-hidden">
        {t('dish')}
      </label>
      <Controller
        name="dish"
        control={control}
        rules={{
          required: true,
          minLength: 4,
        }}
        render={({ field }) => (
          <CreatableSelect
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: '#77D7DB',
                primary: '#231F20',
              },
            })}
            isValidNewOption={(option) => (option.length > 3)}
            placeholder={t('dishplaceholder')}
            isClearable
            options={data.dishes.map((dish) => ({
              label: dish.name,
              value: dish.name,
            }))}
            {...field}
          />
        )}
      />
      <ErrorMessage errors={errors} name="dish" />
      <p className="pt-2">{t('glossary:for')}</p>
      <label htmlFor="type" className="form-label visually-hidden">
        {t('mealtype')}
      </label>
      <Controller
        name="type"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <ReactSelect
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: '#77D7DB',
                primary: '#231F20',
              },
            })}
            options={[
              { value: '1', label: t('glossary:breakfast') },
              { value: '2', label: t('glossary:lunch') },
              { value: '3', label: t('glossary:dinner') },
            ]}
            {...field}
          />
        )}
      />
      <ErrorMessage errors={errors} name="type" />
      <button
        className="btn w-100"
        type="button"
        disabled={isLoading}
        onClick={() => {
          reset(defaultValues);
        }}
      >
        {t('reset')}
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="btn w-100"
      >
        {t('create')}

      </button>
    </form>
  );
}
